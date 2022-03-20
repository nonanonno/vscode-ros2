# Change Log

## 0.1.5 (2022-3-20)
### Added
- Auto detect `/opt/ros/<distro>` as ROS root when `rosRootDir` is empty in the configuration

## 0.1.4 (2021-10-18)
### Fixed
- Syntax highlighting is now work in the case 2 or more spaces exist after a type description

### Internal
- Separate LSP client function from extension.ts
- Add test for LSP client

## 0.1.3 (2021-07-24)
### Internal
- Setup CI for publishing the package

## 0.1.2 (2021-07-24)
### Added
- LSP Server/Client for ROS2 interface files (`.msg`, `.srv`, `.action`)
  - Can jump to a definition

~~0.1.1 (2021-07-24)~~

~~0.1.0 (2021-07-24)~~

## 0.0.1 (2021-06-01)
### Added
- Syntax highting for ROS2 interface files (`.msg`, `.srv`, `.action`)
