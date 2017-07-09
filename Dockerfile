# Download OS image
FROM debian:stretch

# Expose port of application
EXPOSE 3000

# Add project sources
ADD /app /var/www/curvation

# Change current directory
WORKDIR /var/www/curvation

# Install project dependencies
RUN apt-get -qq update \
&& apt-get -qq -y install -y curl gnupg \
&& curl -sL https://deb.nodesource.com/setup_8.x | bash - \
&& apt-get install -qq -y nodejs \
&& npm install -g gulp

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