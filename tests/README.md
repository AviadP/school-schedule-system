# Tests

This directory contains unit tests for the school schedule system.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

## Test Structure

- `config.test.js` - Tests for configuration constants
- `schedule-loader.test.js` - Tests for schedule data loading functions
- `utils.test.js` - Tests for utility functions

## What's Being Tested

### Configuration Tests
- Validates all required constants exist
- Checks data structure integrity
- Verifies Hebrew text values

### Schedule Loader Tests  
- Tests data loading for all grade levels
- Validates fallback behavior
- Ensures consistent data structure

### Utility Function Tests
- Tests pure functions for data manipulation
- Validates input validation functions
- Tests statistics calculation

## Coverage

Currently testing 53 test cases covering:
- ✅ Configuration validation
- ✅ Data loading functions
- ✅ Utility functions
- ✅ Input validation
- ✅ Data structure consistency

## Notes

- Tests use Jest with ES modules
- All tests should pass before making changes
- Add new tests when adding new functionality