export const errorHandler = (statusCode: number, message: string) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}
