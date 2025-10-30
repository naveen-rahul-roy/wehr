import axios from 'axios';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(70)}${colors.reset}\n`)
};

async function checkFileExists(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log.success(`${description} exists`);
      return true;
    } else {
      log.error(`${description} not found`);
      return false;
    }
  } catch (error) {
    log.error(`Error checking ${description}: ${error.message}`);
    return false;
  }
}

async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 3000
    });
    log.success('Backend server is running');
    log.info(`  Status: ${response.data.status}`);
    log.info(`  Message: ${response.data.message}`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.error('Backend server is not running');
      log.warning('  Start it with: cd server && npm start');
    } else {
      log.error(`Backend health check failed: ${error.message}`);
    }
    return false;
  }
}

async function checkFrontendConfig() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('VITE_API_URL=http://localhost:5000/api')) {
      log.success('Frontend .env configured correctly');
      return true;
    } else {
      log.warning('Frontend .env may need updating');
      log.info('  Expected: VITE_API_URL=http://localhost:5000/api');
      return false;
    }
  } catch (error) {
    log.error('.env file not found or unreadable');
    return false;
  }
}

async function checkBackendConfig() {
  try {
    const envContent = fs.readFileSync('server/.env', 'utf8');
    const checks = [
      { key: 'MONGODB_URI', required: true },
      { key: 'JWT_SECRET', required: true },
      { key: 'PORT', required: true }
    ];
    
    let allGood = true;
    checks.forEach(check => {
      if (envContent.includes(check.key)) {
        log.success(`Backend ${check.key} configured`);
      } else {
        log.error(`Backend ${check.key} missing`);
        allGood = false;
      }
    });
    return allGood;
  } catch (error) {
    log.error('server/.env file not found or unreadable');
    return false;
  }
}

async function checkServiceFiles() {
  const services = [
    'services/api.ts',
    'services/employeeService.ts',
    'services/departmentService.ts',
    'services/leaveService.ts',
    'services/attendanceService.ts'
  ];
  
  let allExist = true;
  for (const service of services) {
    const exists = await checkFileExists(service, `Service: ${path.basename(service)}`);
    if (!exists) allExist = false;
  }
  return allExist;
}

async function checkBackendRoutes() {
  const routes = [
    'server/routes/auth.js',
    'server/routes/employees.js',
    'server/routes/departments.js',
    'server/routes/leaves.js',
    'server/routes/attendance.js'
  ];
  
  let allExist = true;
  for (const route of routes) {
    const exists = await checkFileExists(route, `Route: ${path.basename(route)}`);
    if (!exists) allExist = false;
  }
  return allExist;
}

async function checkBackendModels() {
  const models = [
    'server/models/User.js',
    'server/models/Employee.js',
    'server/models/Department.js',
    'server/models/LeaveRequest.js',
    'server/models/Attendance.js'
  ];
  
  let allExist = true;
  for (const model of models) {
    const exists = await checkFileExists(model, `Model: ${path.basename(model)}`);
    if (!exists) allExist = false;
  }
  return allExist;
}

async function checkDependencies() {
  try {
    // Check frontend dependencies
    const frontendPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (frontendPackage.dependencies.axios && frontendPackage.dependencies.react) {
      log.success('Frontend dependencies configured');
    } else {
      log.warning('Frontend dependencies may be incomplete');
    }
    
    // Check backend dependencies
    const backendPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
    if (backendPackage.dependencies.express && backendPackage.dependencies.mongoose) {
      log.success('Backend dependencies configured');
    } else {
      log.warning('Backend dependencies may be incomplete');
    }
    
    return true;
  } catch (error) {
    log.error(`Error checking dependencies: ${error.message}`);
    return false;
  }
}

async function runVerification() {
  console.log(`\n${colors.magenta}${'='.repeat(70)}`);
  console.log('HRMS SYSTEM VERIFICATION');
  console.log(`${'='.repeat(70)}${colors.reset}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  // Check 1: File Structure
  log.section('1. Checking File Structure');
  const filesOk = await checkFileExists('App.tsx', 'App.tsx') &&
                  await checkFileExists('types.ts', 'types.ts') &&
                  await checkFileExists('server/server.js', 'server.js');
  if (filesOk) results.passed++; else results.failed++;
  
  // Check 2: Configuration Files
  log.section('2. Checking Configuration');
  const frontendConfigOk = await checkFrontendConfig();
  const backendConfigOk = await checkBackendConfig();
  if (frontendConfigOk && backendConfigOk) results.passed++; else results.failed++;
  
  // Check 3: Service Layer
  log.section('3. Checking Service Layer');
  const servicesOk = await checkServiceFiles();
  if (servicesOk) results.passed++; else results.failed++;
  
  // Check 4: Backend Routes
  log.section('4. Checking Backend Routes');
  const routesOk = await checkBackendRoutes();
  if (routesOk) results.passed++; else results.failed++;
  
  // Check 5: Database Models
  log.section('5. Checking Database Models');
  const modelsOk = await checkBackendModels();
  if (modelsOk) results.passed++; else results.failed++;
  
  // Check 6: Dependencies
  log.section('6. Checking Dependencies');
  const depsOk = await checkDependencies();
  if (depsOk) results.passed++; else results.failed++;
  
  // Check 7: Backend Server
  log.section('7. Checking Backend Server');
  const backendOk = await checkBackendHealth();
  if (backendOk) results.passed++; else results.failed++;
  
  // Summary
  log.section('VERIFICATION SUMMARY');
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  if (results.failed > 0) {
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  }
  if (results.warnings > 0) {
    console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  
  if (results.failed === 0) {
    console.log(`${colors.green}✓ System verification passed!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Ensure backend is running: ${colors.yellow}cd server && npm start${colors.reset}`);
    console.log(`  2. Start frontend: ${colors.yellow}npm run dev${colors.reset}`);
    console.log(`  3. Run tests: ${colors.yellow}node test-complete-system-final.js${colors.reset}`);
    console.log(`  4. Open browser: ${colors.yellow}http://localhost:5173${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ System verification found issues${colors.reset}`);
    console.log(`\n${colors.cyan}Please fix the issues above and run verification again.${colors.reset}`);
  }
  
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

runVerification().catch(console.error);
