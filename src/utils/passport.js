import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../config/db.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db('User').where('google_id', id).first();
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const state = JSON.parse(req.query.state);
        const roleFromFrontend = state.role;

        // Debugging
        // console.log('Role from Frontend:', roleFromFrontend);

        if (!roleFromFrontend) {
          return done(null, false, { message: 'Role not provided' });
        }

        // Get the role ID based on the role from the frontend
        let role = await db('Role').where({ name: roleFromFrontend }).first();
        if (!role) {
          [role] = await db('Role').insert({ name: roleFromFrontend });
        }

        let user = await db('User').where({ email }).first();

        if (!user) {
          // If user does not exist, create a new user
          await db('User').insert({
            google_id: profile.id,
            email: profile._json.email,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            isVerified: true,
            role_id: role,
          });
          user = await db('User').where({ email }).first(); // Use the first element from the returned array

          console.log('New user created: ', user);
          return done(
            null,
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            { message: 'Signup successful' }
          );
        } else {
          const userRole = await db('Role').where({ id: user.role_id }).first();

          if (userRole.name !== roleFromFrontend) {
            return done(null, false, { message: 'Role does not match' });
          }
          // If user exists but Google ID is not associated, associate it
          if (!user.google_id || user.google_id === null) {
            console.log('Login successful', user);
            await db('User').where({ email }).update({
              google_id: profile.id,
              isVerified: true,
              role_id: role.id,
            });

            return done(
              null,
              {
                id: user.id,
                name: user.name,
                email: user.email,
              },
              { message: 'Login successful' }
            );
          }

          // If Google ID matches, login is successful
          if (user.google_id === profile.id) {
            console.log('Google ID matches, login successful');
            return done(
              null,
              {
                id: user.id,
                name: user.name,
                email: user.email,
              },
              { message: 'Login successful' }
            );
          }
        }

        // If none of the conditions match, authentication failed
        return done(null, false, { message: 'Authentication failed' });
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

export default passport;

// Role in /google route: passenger
// Role in /google route: passenger
// Line 38: {
//   code: '4/0AcvDMrDriGvTp4hzQrb52BypafokDXsnloXX2U2hvmRvgpkSWbnDhUFJAvOp1ygE6GYRMg',
//   scope: 'email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
//   authuser: '0',
//   prompt: 'consent'
// }
// Role from Frontend: undefined
