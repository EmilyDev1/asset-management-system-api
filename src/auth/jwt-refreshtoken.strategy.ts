import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException, Body } from "@nestjs/common";
import { AdminService } from "src/admin/admin.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refreshtoken"
) {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("accessToken"),
      ignoreExpiration: false,
      secretOrKey: "Thdjudy68X73TY",
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    const user = await this.adminService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    if (req.body.refreshToken != user.refreshToken) {
      throw new UnauthorizedException();
    }
    if (new Date() > new Date(user.refreshtokenexpires)) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
