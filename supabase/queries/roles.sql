-- ============================================================================
-- roles.sql — Quick role audit (run in Supabase SQL Editor)
-- ============================================================================
-- Lists every account, its role, and a few Auth signals. Read-only.
-- ============================================================================

select
  p.email,
  p.full_name,
  case
    when p.is_superadmin then 'superadmin'
    when p.is_admin      then 'admin'
    else                      'user'
  end                                   as role,
  u.email_confirmed_at is not null      as email_confirme,
  u.last_sign_in_at,
  p.created_at
from public.profiles p
left join auth.users u on u.id = p.id
order by
  p.is_superadmin desc,
  p.is_admin      desc,
  p.created_at    asc;

-- ---------------------------------------------------------------------------
-- Variantes utiles :

-- Compter par rôle
-- select
--   count(*) filter (where is_superadmin)              as superadmins,
--   count(*) filter (where is_admin and not is_superadmin) as admins,
--   count(*) filter (where not is_admin)               as users
-- from public.profiles;

-- Voir uniquement les superadmins
-- select email, full_name, created_at
-- from public.profiles
-- where is_superadmin
-- order by created_at;

-- Profils orphelins (ligne profiles sans user Auth correspondant)
-- select p.email, p.id
-- from public.profiles p
-- left join auth.users u on u.id = p.id
-- where u.id is null;
