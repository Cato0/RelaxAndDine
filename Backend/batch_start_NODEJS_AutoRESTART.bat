
@echo off
set ProgrammExe=node.exe 
set zeitSek=3
start nodevars.bat
echo Programm wird gestartet...  &start %ProgrammExe% nodeJS

:loop

::echo Warte %zeitSek% Sekunden...
timeout /T %zeitSek%   > nul
tasklist|find "%ProgrammExe%">nul

if not errorlevel 1  goto:loop

echo Programm wird neu gestartet... %time%__%date% 
start %ProgrammExe%  nodeJS  &goto:loop







