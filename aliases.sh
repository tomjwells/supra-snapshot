# Usage: source aliases.sh 

# vn (Vercel nextjs) Deploy Commands
alias vn="cd apps/nextjs   && pnpm install --filter \!home     --filter \!checkout && cd ../.. && npx turbo run build --filter=@acme/nextjs...   --no-cache"
alias vc="cd apps/checkout && pnpm install --filter \!home     --filter \!nextjs   && cd ../.. && npx turbo run build --filter=@acme/checkout... --no-cache"
alias vh="cd apps/home     && pnpm install --filter \!checkout --filter \!nextjs   && cd ../.. && npx turbo run build --filter=@acme/home...     --no-cache"

# fix nanoid/postcss bug
alias f="sed -i -E 's/nanoid: [0-9.]+/nanoid: 3.3.7/g' pnpm-lock.yaml || true"

# rm
alias r="rm pnpm-lock.yaml || true"

# dev
alias d="p && pnpm dev"

# install
alias i="f && pnpm i && f"

# portkill
alias p="portkill 5555 5556 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 > /dev/null || true"

# generate
#  - Clears both bun and turbo cache
alias g="pnpm db:generate"

# build
alias b="pnpm build"

# all
alias a="c && w && r && i && g && p && d"

# all build
alias ab="c && r && i && g && p && b"

# clean
alias c="pnpm clean:workspaces"

# Wipe
alias w="(find . -name node_modules -exec rm -rf {} \; && find . -name .next -exec rm -rf {} \; &) || true "

# Vercel CLI Commands
alias logs="vercel logs checkout.suprapayments.io --follow --output raw"


# Use a function since aliases don't accept arguments
portkill() {
  for var in "$@"
  do
    echo "Portkill: $var"
    kill -9 $(lsof -i tcp:$var | tail -n +2 | awk '{ print $2 }') > /dev/null &
  done
}