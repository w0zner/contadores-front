export class Usuarios {
    constructor(
        public nombre: string,
        public email: string,
        public curp: string,
        public telefono: string,
        public estado: Boolean,
        public password?: string,
        public password2?: string,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string
    ){}
}
