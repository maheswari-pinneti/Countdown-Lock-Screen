# Data Validation & Type Guards

## 1. Import Validation
When users restore backups via `importAppState(jsonString)`, the JSON is structurally validated:
- Must contain an array of `experiences` with valid IDs.
- Numerical fields are checked for `NaN` and bounded to reasonable ranges.
- Unknown fields are stripped to prevent prototype pollution.
