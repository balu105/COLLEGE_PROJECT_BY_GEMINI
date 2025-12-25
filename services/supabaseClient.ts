
import { createClient } from '@supabase/supabase-js';

/**
 * SUPABASE CONNECTION DETAILS
 * Using credentials provided for project: apnwdwafkdhqtubgwrik
 */

const supabaseUrl = 'https://apnwdwafkdhqtubgwrik.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbndkd2Fma2RocXR1Ymd3cmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzI1MzMsImV4cCI6MjA4MTY0ODUzM30.u5WwXMTmJk0_ms12kA5PJ55TFDnkZobCvK36cDspdlQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
