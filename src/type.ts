export interface ApiResponseDto<T> {
    data: T;
}

interface RougeMetric {
    f: number;
    p: number;
    r: number;
}

interface Metrics {
    rouge: Record<string, RougeMetric>;
}

export interface AiChatLog {
    id: string
    executor_id: string
    conversation_id: string
    input: string
    output: string
    input_token: number
    output_token: number
    start_datetime: Date
    end_datetime: Date
    metrics: Metrics
}

export interface AiConversationLog {
    _id: string;
    executor_id: string;
    model_name: string;
    system_instruction: string[];
    chats: AiChatLog[];
    total_input_token: number;
    total_output_token: number;
    created_at: string;
    updated_at?: string;
}
  
export interface ConversationLogResponse {
    log: AiConversationLog;
}

export interface Company {
    name: string;
    link: string;
}

export interface Job {
    id: string;
    domain: string;
    url: string;
    title: string;
    location: string;
    company: Company;
    salary: string;
    work_type: string;
    description: string;
    raw_description: string;
    description_hash: string;
    created_at: string;
    updated_at: string | null;
    chat_logs: AiChatLog[];
}

export interface Cursor {
    previous_page_token: string | null;
    next_page_token: string | null;
}

export interface JobResponse {
    job: Job;
}

export interface JobsResponse {
    jobs: Job[];
    cursor: Cursor;
}

export interface Mail {
  id: string;
  sender: string;
  title: string;
  date: string;
  detailMail?: any;
  extracted_data?: string;
  read?: boolean;
}

export interface FittingResponse {
  job_id: string;
  chat_log_id: string;
  link: string;
  ai_response: string;
}
