
export interface ApiResponseDto<T> {
    data: T;
}

export interface AiChatLog {
    conversation_id: string
    input: string
    output: string
    input_token: number
    output_token: number
    start_datetime: Date
    end_datetime: Date
    metrics: Object
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

export interface Job {
    _id: string;
    title: string;
    url: string;
    domain: string;
    description?: string;
    created_at: string;
    updated_at: string | null;
    chat_logs: AiChatLog[];
}

export interface Cursor {
    previous_page_token: string | null;
    next_page_token: string | null;
}

export interface JobResponse {
    jobs: Job[];
    cursor: Cursor;
}