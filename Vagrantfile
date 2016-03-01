# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest:8080, host: 8080, auto_correct: true
  config.vm.network "private_network", ip: "192.168.50.4"
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  # Uncomment this if you want to link to a shared folder (e.g. if you are running source control and want to link it to Vagrant)
  if (Vagrant::Util::Platform.windows?)
    config.vm.synced_folder "./", "/home/vagrant/curvation", create: true, type: "smb"
  else
    config.vm.synced_folder "./", "/home/vagrant/curvation", create: true, type: "nfs"
  end
  config.vm.provision "shell", path: "setup.sh"

end
