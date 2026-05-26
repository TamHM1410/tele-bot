export class ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;

  constructor(params: {
    success?: boolean;
    status: number;
    message: string;
    data?: T;
    error?: any;
  }) {
    this.success = params.success ?? true;
    this.status = params.status;
    this.message = params.message;
    this.data = params.data;
    this.error = params.error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = "OK", status = 200) {
    return new ApiResponse<T>({
      success: true,
      status,
      message,
      data,
    });
  }

  static error(message = "Internal Server Error", status = 500, error?: any) {
    return new ApiResponse({
      success: false,
      status,
      message,
      error,
    });
  }
}

export default ApiResponse;
