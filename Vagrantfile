VAGRANTFILE_API_VERSION = "2"

# Cross-platform way of finding an executable in the $PATH.
def which(cmd)
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each { |ext|
      exe = File.join(path, "#{cmd}#{ext}")
      return exe if File.executable?(exe) && !File.directory?(exe)
    }
  end
  return nil
end

# Use config.yml for basic VM configuration.
require 'yaml'
dir = File.dirname(File.expand_path(__FILE__))
vconfig = YAML::load_file("#{dir}/Vagrant_config.yml")
# Use a local config file to define specific values (IP, host cpu/memory...)
if !File.exist?("#{dir}/Vagrant_config_local.yml")
  raise 'Local configuration file Vagrant_config_local.yml not found! Please use Vagrant_config_local.yml.example as an example and try again.'
end
vconfig_local = YAML::load_file("#{dir}/Vagrant_config_local.yml")
vconfig.merge!(vconfig_local)

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = vconfig['vagrant_hostname']
  config.vm.provider "virtualbox" do |v|
    v.memory = vconfig['vagrant_memory']
    v.cpus = vconfig['vagrant_cpus']
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end
  if vconfig['vagrant_ip'] == "0.0.0.0" && Vagrant.has_plugin?("vagrant-auto_network")
    config.vm.network :private_network, :ip => vconfig['vagrant_ip'], :auto_network => true
  else
    config.vm.network :private_network, ip: vconfig['vagrant_ip']
  end

  if !vconfig['vagrant_public_ip'].nil? && vconfig['vagrant_public_ip'] == "0.0.0.0"
    config.vm.network :public_network
  elsif !vconfig['vagrant_public_ip'].nil?
    config.vm.network :public_network, ip: vconfig['vagrant_public_ip']
  end

  config.ssh.insert_key = false
  config.ssh.forward_agent = true

  config.vm.box = vconfig['vagrant_box']

  for synced_folder in vconfig['vagrant_synced_folders'];
    config.vm.synced_folder synced_folder['local_path'], synced_folder['destination'],
      type: synced_folder['type'],
      rsync__auto: "true",
      rsync__exclude: synced_folder['excluded_paths'],
      rsync__args: ["--verbose", "--archive", "--delete", "-z", "--chmod=ugo=rwX"],
      id: synced_folder['id'],
      create: synced_folder.include?('create') ? synced_folder['create'] : false,
      mount_options: synced_folder.include?('mount_options') ? synced_folder['mount_options'] : []
  end
  
  config.vm.provider :virtualbox do |v|
    v.name = vconfig['vagrant_hostname']
    v.memory = vconfig['vagrant_memory']
    v.cpus = vconfig['vagrant_cpus']
  end

  config.vm.provision "file", source: "app", destination: "/tmp/curvation"
  config.vm.provision "shell", privileged: false, path: "Vagrant_setup.sh"
  config.vm.provision "shell", privileged: false, path: "Vagrant_boot.sh", run: 'always'

  # Set the name of the VM. See: http://stackoverflow.com/a/17864388/100134
  config.vm.define vconfig['vagrant_machine_name'] do |d|
  end
end