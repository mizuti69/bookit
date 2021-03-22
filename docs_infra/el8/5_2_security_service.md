---
id: security_service
title: "不要なサービスの停止"
---
import { LinkTag } from './basecomponent.jsx';

## 不要なサービスの確認
利用しないサービスが起動している事によるセキュリティホール化や、  
意図しないサービスによるリソース消費を抑えるために不要なサービスは停止しておく  

現在起動しているサービスの確認  

```
# systemctl list-units --type service |grep active
```

デフォルトで有効化されているサービス例  

| service name                       | description                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| atd.service                        | Job spooling tools                                                            |
| auditd.service                     | Security Auditing Service                                                     |
| chronyd.service                    | NTP client/server                                                             |
| crond.service                      | Command Scheduler                                                             |
| dbus.service                       | D-Bus System Message Bus                                                      |
| firewalld.service                  | Restore /run/initramfs on shutdown                                            |
| getty@.service                     | Getty on tty1                                                                 |
| import-state.service               | Import network configuration from initramfs                                   |
| irqbalance.service                 | irqbalance daemon                                                             |
| kmod-static-nodes.service          | Create list of required static device nodes for the current kernel            |
| libstoragemgmt.service             | libstoragemgmt plug-in server daemon                                          |
| lvm2-monitor.service               | Monitoring of LVM2 mirrors, snapshots etc. using dmeventd or progress polling |
| lvm2-pvscan@8:2.service            | LVM event activation on device 8:2                                            |
| mcelog.service                     | Machine Check Exception Logging Daemon                                        |
| NetworkManager-wait-online.service | Network Manager Wait Online                                                   |
| NetworkManager.service             | Network Manager                                                               |
| nis-domainname.service             | Read and set NIS domainname from /etc/sysconfig/network                       |
| polkit.service                     | Authorization Manager                                                         |
| rhsmcertd.service                  | Enable periodic update of entitlement certificates.                           |
| rngd.service                       | Hardware RNG Entropy Gatherer Daemon                                          |
| rsyslog.service                    | System Logging Service                                                        |
| smartd.service                     | Self Monitoring and Reporting Technology (SMART) Daemon                       |
| sshd.service                       | OpenSSH server daemon                                                         |
| systemd-journal-flush.service      | Flush Journal to Persistent Storage                                           |
| systemd-journald.service           | Journal Service                                                               |
| systemd-logind.service             | Login Service                                                                 |
| systemd-random-seed.service        | Load/Save Random Seed                                                         |
| systemd-remount-fs.service         | Remount Root and Kernel File Systems                                          |
| systemd-sysctl.service             | Apply Kernel Variables                                                        |
| systemd-tmpfiles-setup-dev.service | Create Static Device Nodes in /dev                                            |
| systemd-tmpfiles-setup.service     | Create Volatile Files and Directories                                         |
| systemd-udev-trigger.service       | udev Coldplug all Devices                                                     |
| systemd-udevd.service              | udev Kernel Device Manager                                                    |
| systemd-update-utmp.service        | Update UTMP about System Boot/Shutdown                                        |
| systemd-user-sessions.service      | Permit User Sessions                                                          |
| tuned.service                      | Dynamic System Tuning Daemon                                                  |
| user-runtime-dir@0.service         | /run/user/0 mount wrapper                                                     |
| user@0.service                     | User Manager for UID 0                                                        |
| vdo.service                        | VDO volume services                                                           |

リスニングポートとサービスの確認  

```
# netstat -pan -A inet,inet6
# ss -luatp
```
