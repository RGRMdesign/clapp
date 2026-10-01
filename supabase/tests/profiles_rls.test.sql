-- pgTAP tests for profiles RLS. Run with `pnpm db:test` (requires `supabase start`).
begin;
select plan(4);

-- two users
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

select is(
  (select count(*)::int from public.profiles),
  2,
  'a profile is created for every new user'
);

-- act as alice
set local role authenticated;
-- set both the current and the legacy claim setting read by auth.uid()
set local request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select is(
  (select count(*)::int from public.profiles),
  1,
  'a user only sees their own profile'
);

update public.profiles set display_name = 'Mallory' where id = '22222222-2222-2222-2222-222222222222';
update public.profiles set display_name = 'Alice' where id = '11111111-1111-1111-1111-111111111111';
select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice',
  'a user can update their own profile'
);

reset role;
select is(
  (select display_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  null,
  'updating another user''s profile has no effect'
);

select * from finish();
rollback;
