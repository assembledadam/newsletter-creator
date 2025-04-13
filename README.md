# newsletter-creator

## Run in dev
```
yarn dev
```

## Supabase operations
### To set up supabase operations
```
supabase login
```

### To push a supabase migration
```
// not sure if this works
supabase migration up
supabase db push
```

### To push a supabase function
```
supabase functions deploy generate-newsletter
```

### To set a secret
```
supabase secrets set GOOGLE_API_KEY=<secret>
```
