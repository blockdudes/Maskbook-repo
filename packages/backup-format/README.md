# Backup format

## Backup file container

Binary format:

```plain
Magic header (MASK-BACKUP-V001): 16 bytes
Data: Arbitrary length
Checksum (SHA-256): 32 bytes
```
