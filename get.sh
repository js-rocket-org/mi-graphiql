#!/bin/sh
# This script bundles multiple libraries into one
# tip add <meta charset="UTF-8"> in HTML file to get rid of strange characters
#
files=(
https://unpkg.com/react/umd/react.production.min.js
https://unpkg.com/react-dom/umd/react-dom.production.min.js
https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.17.5/graphiql.min.css
https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.17.5/graphiql.min.js
)

for var in "${files[@]}"
do
  echo "${var}"
  curl -L -O ${var}
done

# download IE10 polyfills
curl -L -o polyfill.min.js -A "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)" \
  "https://cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch,Array.prototype.includes"

# download IE11 polyfills
# curl -L -o polyfill.min.js -A "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko" \
#   "https://cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch,Array.prototype.includes"

cat polyfill.min.js react.production.min.js react-dom.production.min.js graphiql.min.js > ./docs/lib-bundle.js
# rm react.production.min.js react-dom.production.min.js graphiql.min.js
