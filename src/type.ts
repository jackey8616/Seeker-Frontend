
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
    executor_id: string;
    model_name: string;
    system_instruction: string[];
    chats: AiChatLog[];
    total_input_token: number;
    total_output_token: number;
    created_at: string;
    _id: string;
    updated_at?: string;
}
  
export interface ConversationLogResponse {
    log: AiConversationLog;
}