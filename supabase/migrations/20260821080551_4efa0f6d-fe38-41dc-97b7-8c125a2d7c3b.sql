revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke all on function public.claim_admin() from public, anon;
grant execute on function public.claim_admin() to authenticated, service_role;