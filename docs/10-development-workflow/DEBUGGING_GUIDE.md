# Debugging & Diagnostics Guide

## 1. Logging Inspection
Access client logs in the developer console:
```javascript
import { logger } from './src/services/loggerService';
console.table(logger.getLogs());
```
