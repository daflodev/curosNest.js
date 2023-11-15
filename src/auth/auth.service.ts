import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/resgister.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register({ name, email, password }: RegisterDto) {

        const users = await this.usersService.findOneByEmail(email);
        if (users) {
            throw new BadRequestException(`User ${name} already registered`);
        }
            await this.usersService.create({
            name, email, password: await bcrypt.hash(password, 10)
        });
        return{
            name, email 
        }
    }

    async login({ email, password }: LoginDto) {
        const users = await this.usersService.findByEmailWithPassword(email);
        if (!users) {
            throw new UnauthorizedException('users not exists')
        }
        const isPasswordValid = await bcrypt.compare(password, users.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong')

        }

        const payload = { email: users.email, role: users.role };

        const access_token = await this.jwtService.signAsync(payload)
        return {
            access_token,
            email
        };




    }
    async profile({ email, role }: { email: string; role: string }) {

        return await this.usersService.findOneByEmail(email)
    }


}
