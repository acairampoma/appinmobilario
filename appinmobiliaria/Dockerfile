# Use Nginx to serve a static site
FROM nginx:alpine

# Set working dir
WORKDIR /usr/share/nginx/html

# Remove default content
RUN rm -rf ./*

# Copy app files
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway typically exposes $PORT; make sure Nginx listens there
# Our nginx.conf uses 8080; Railway maps $PORT -> 8080 externally
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
