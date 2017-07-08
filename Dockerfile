# Download OS image
FROM debian:jessie

# Expose port of application
EXPOSE 3000

# Add project sources
ADD /app /app

# Change current directory
WORKDIR /app

# Install project
RUN apt update \
&& apt install -y nodejs build-essential npm libssl-dev ruby git \
&& ln -s /usr/bin/nodejs /usr/bin/node \
&& npm install -g bower grunt-cli nodemon \
&& gem install sass \
&& npm install \
&& bower install --allow-root \
&& grunt init

# Launch app when container starts
CMD npm start