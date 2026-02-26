@echo off
echo Cloning repository...

git clone https://github.com/ShehzadIqbal1/leadsyncflow.git

cd leadsyncflow

echo Installing dependencies...
npm install

echo.
echo Setup complete!
pause