export function reply(status: number, message: string, data?: object) {
    return {
        meta: {
            status,
            message,
        },
        data,
    };
}
