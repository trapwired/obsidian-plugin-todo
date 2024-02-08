## Fork of Obsidian TODO Plugin

Text-based GTD in Obsidian.

### Changes from forked Repository
- Split out TODOs by type ("Today", "Without Date", "Upcoming" and "Waiting")
- Mark a TODO to be on hold / waiting by adding #wait
- Different workspaces support (Indicated at top of plugin-window)
  - Personal, Work or CaDo (hardcoded)
  - Assign Workspace by either tags (#me...) or folders (config is hardcoded, sorry, contact me for help)
    - default is work
  - Switch Workspace by pressing the indicator-text (at top of plugin-window)

### use in Obsidian
- Clone the repo directly into ```yourVault/.obsidian/plugins```
- Command-Line commands, in repo-root
  - once: ```npm update```, ```npm audit fix```, ```yarn install```, ```npm i```
  - after every change: ```npm run dev```
