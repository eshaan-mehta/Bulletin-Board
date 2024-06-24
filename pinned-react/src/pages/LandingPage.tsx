import  Hero  from '@/components/hero';
import  Affiliates  from '@/components/affiliates';
import  About  from '@/components/about.tsx'; 
import Wrap  from '@/components/wrap.tsx'; 
import OurTeam from '@/components/team.tsx';

const LandingPage = () => {
  return (
      <section className=''>
         <Hero />
         <Affiliates />
         <About />
         <OurTeam />
         <Wrap />
      </section>
   );
};

export default LandingPage;




{/* <div className="flex items-center w-screen pl-3 bg-gray-100 border-b border-black h-14 text-primary">
            <h1 className="text-3xl font-bold">
                  <Link to="/"> Pinned </Link>
            </h1>
         </div>

         <div className='flex gap-3 p-2'>
         <SignInButton 
            afterSignInUrl='/dashboard'
            redirectUrl='/sign-in'
         >
            <div className='p-2 text-xl font-semibold text-white rounded-lg bg-primary hover:cursor-pointer'>
               Sign In
            </div>
         </SignInButton>
         <SignUpButton 
            afterSignInUrl='/dashboard'
            redirectUrl='/sign-up'
         >
            <div  className='p-2 text-xl font-semibold text-white rounded-lg bg-primary hover:cursor-pointer'>
               Sign Up
            </div>
         </SignUpButton> 
 ] <SignOutButton>
         <div  className='p-2 text-xl font-semibold text-white rounded-lg bg-primary hover:cursor-pointer'>
               Sign Out
            </div>
         </SignOutButton> 
</div> */}