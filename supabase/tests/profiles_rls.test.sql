-- pgTAP tests for public.profiles RLS. Run with `pnpm db:test:docker` (or `pnpm db:test` with a local stack).
begin;
select plan(9);

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', '{}'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', jsonb_build_object('display_name', repeat('x', 200)));

select is(
  (select count(*)::int from public.profiles),
  2,
  'a profile is created for every new user'
);
select is(
  (select char_length(display_name) from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  80,
  'an over-long display_name from sign-up metadata is truncated instead of failing sign-up'
);

-- anonymous visitors
set local role anon;
select is((select count(*)::int from public.profiles), 0, 'anon sees no profiles');
reset role;

-- act as alice (set both the current and the legacy claim setting read by auth.uid())
set local role authenticated;
set local request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select is((select count(*)::int from public.profiles), 1, 'a user only sees their own profile');

update public.profiles set display_name = 'Mallory' where id = '22222222-2222-2222-2222-222222222222';
update public.profiles set display_name = 'Alice' where id = '11111111-1111-1111-1111-111111111111';
select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice',
  'a user can update their own display_name'
);

select throws_ok(
  $$update public.profiles set created_at = now() - interval '1 year' where id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'other columns cannot be updated'
);
select throws_ok(
  $$insert into public.profiles (id) values ('33333333-3333-3333-3333-333333333333')$$,
  '42501',
  null,
  'users cannot insert profiles'
);
select throws_ok(
  $$delete from public.profiles where id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'users cannot delete profiles'
);

reset role;
select is(
  (select display_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  repeat('x', 80),
  'updating another user''s profile has no effect'
);

select * from finish();
rollback;
