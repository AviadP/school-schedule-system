# School Schedule System

[![CI](https://github.com/AviadP/school-schedule-system/workflows/CI/badge.svg)](https://github.com/AviadP/school-schedule-system/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-53%20passing-brightgreen)](https://github.com/AviadP/school-schedule-system/actions)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/AviadP/school-schedule-system/actions)

Interactive Hebrew school schedule management system for grades 3-9.

**🌐 [Live Site](https://aviadp.github.io/school-schedule-system/)**

## Features

- 📅 **Multi-grade support** - Separate schedules for grades 3-4, 5-6, and 7-9
- 🔄 **Auto-sync** - Identical courses automatically sync across time slots
- ⚠️ **Conflict detection** - Warns about teacher scheduling conflicts
- 📊 **Export functionality** - Download schedules as CSV files
- 🧪 **Unit tested** - 53 passing tests with 100% coverage
- 🏗️ **Modular structure** - Clean, maintainable codebase

## Quick Start

### Online
Visit [aviadp.github.io/school-schedule-system](https://aviadp.github.io/school-schedule-system/)

### Local Development
```bash
git clone https://github.com/AviadP/school-schedule-system.git
cd school-schedule-system
npm install
npm run dev
```

Open http://localhost:8080

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Watch mode for development
npm run test:watch
```

## Project Structure

```
school-schedule-system/
├── index.html          # Main application
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── app.js          # Main application logic
│   ├── config.js       # Configuration constants
│   ├── table-builder.js # Schedule table functionality
│   ├── excel-export.js # Export functionality
│   └── utils.js        # Utility functions
├── data/
│   ├── schedule-loader.js # Data loading module
│   └── schedules/      # Schedule data for each grade
└── tests/              # Unit tests (Jest)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass (`npm test`)
5. Submit a pull request

All PRs are automatically tested with GitHub Actions.

## License

MIT

