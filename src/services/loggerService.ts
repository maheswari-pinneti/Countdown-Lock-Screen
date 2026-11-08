/**
 * Client-Side Structured Logger & Security Audit Service for OFFER MODE
 * Manages privacy-preserving in-memory and local diagnostic logs without sending telemetry to external services.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: 'AUTH' | 'STORAGE' | 'COUNTDOWN' | 'CANVAS' | 'NETWORK' | 'SYSTEM';
  message: string;
  metadata?: Record<string, any>;
}

const STORAGE_LOGS_KEY = 'offer_mode_audit_logs_v1';
const MAX_LOGS = 150;

class LoggerService {
  private static instance: LoggerService;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public getLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_LOGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public clearLogs(): void {
    try {
      localStorage.removeItem(STORAGE_LOGS_KEY);
    } catch {}
  }

  private append(entry: AuditLogEntry): void {
    try {
      const current = this.getLogs();
      const updated = [entry, ...current.slice(0, MAX_LOGS - 1)];
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
    } catch {}

    // Console output for development debugging
    if (process.env.NODE_ENV !== 'production' || entry.level === 'SECURITY' || entry.level === 'ERROR') {
      const prefix = `[${entry.level}][${entry.category}]`;
      if (entry.level === 'ERROR' || entry.level === 'SECURITY') {
        console.error(prefix, entry.message, entry.metadata || '');
      } else if (entry.level === 'WARN') {
        console.warn(prefix, entry.message, entry.metadata || '');
      } else {
        console.log(prefix, entry.message, entry.metadata || '');
      }
    }
  }

  public log(level: LogLevel, category: AuditLogEntry['category'], message: string, metadata?: Record<string, any>): void {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata,
    };
    this.append(entry);
  }

  public info(category: AuditLogEntry['category'], message: string, metadata?: Record<string, any>): void {
    this.log('INFO', category, message, metadata);
  }

  public warn(category: AuditLogEntry['category'], message: string, metadata?: Record<string, any>): void {
    this.log('WARN', category, message, metadata);
  }

  public error(category: AuditLogEntry['category'], message: string, metadata?: Record<string, any>): void {
    this.log('ERROR', category, message, metadata);
  }

  public security(message: string, metadata?: Record<string, any>): void {
    this.log('SECURITY', 'AUTH', message, metadata);
  }
}

export const logger = LoggerService.getInstance();
