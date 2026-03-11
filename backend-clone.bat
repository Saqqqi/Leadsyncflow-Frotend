@echo off
echo ========================================
echo    LeadSyncFlow Repository Cloner
echo ========================================
echo.

:SELECT_BRANCH
echo Which branch would you like to clone?
echo.
echo [1] main (stable branch)
echo [2] buggy-work (development branch)
echo.
set /p BRANCH_CHOICE="Enter your choice (1 or 2): "

if "%BRANCH_CHOICE%"=="1" (
    set BRANCH_NAME=main
    goto CLONE_REPO
)
if "%BRANCH_CHOICE%"=="2" (
    set BRANCH_NAME=buggy-work
    goto CLONE_REPO
)

echo.
echo Invalid choice! Please enter 1 or 2.
echo.
goto SELECT_BRANCH

:CLONE_REPO
echo.
echo Cloning repository from %BRANCH_NAME% branch...
echo.

git clone -b %BRANCH_NAME% https://github.com/ShehzadIqbal1/leadsyncflow.git

if errorlevel 1 (
    echo.
    echo Failed to clone repository!
    pause
    exit /b 1
)

cd leadsyncflow

echo.
echo Installing dependencies...
npm install

if errorlevel 1 (
    echo.
    echo Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Setup complete!
echo    Branch: %BRANCH_NAME%
echo    Location: %cd%
echo ========================================
echo.
pause