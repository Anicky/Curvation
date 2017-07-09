# Download OS image
FROM debian:jessie

# Expose port of application
EXPOSE 3000

# Add project sources
ADD /app /var/www/curvation

# Change current directory
WORKDIR /var/www/curvation

# Install project dependencies
RUN apt update -qq \
&& apt install -y curl \
&& curl -sL https://deb.nodesource.com/setup_6.x | bash - \
&& apt install -y nodejs build-essential libssl-dev \
&& npm install -g grunt-cli nodemon browserify

# Add "node" user
RUN useradd -ms /bin/bash node

# Change owner of app folder permission to "node" user
RUN chown -R node:node /var/www/curvation

# Use "node" user for installation
USER node

# Install project
RUN npm install

# Launch app when container starts
CMD npm start