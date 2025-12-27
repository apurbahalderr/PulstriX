class ApiResponse {
    success: boolean;
    msg: string;
    data?: unknown;
    err?: unknown

    constructor(success: boolean, msg: string, data?: unknown, err?: unknown) {
        this.success = success;
        this.msg = msg;
        this.data = data ?? "No data provided";
        this.err = err ?? "No error provided";
    }
}

export default ApiResponse ;