#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <vector>
//#include <bits/stdc++.h> 

#include "serializer.h"
#include "body.h"

//#define EULER
#define SIMPLETIC
//#define VERLET

#define POLAR
//#define CARTESIAN

using namespace std;

//--------------------------- scaling magnitudes ----------------------------
extern long long int L; // Earth-Sun distance
extern long double G; // gravitational constant
extern long double M; // Earth's mass

extern long double T; 
extern long double F; 
extern long double V; 
extern long double A;
extern long double E;
extern long double P;
extern long double M_A;



//------------------------------- global parameters ----------------------------

int N = 2; // number of bodies
double t = 0; // time
double dt = 0.01; // time interval
double t_f = 600; // final time

#ifdef CARTESIAN
//cartesian coordinates
double x_min=0, x_max=1000; // lower and upper limit for positions and velocities
double v_min=0, v_max=1;
#endif

#ifdef POLAR
//polar coordinates
double rho=400;
double v_max=5;
double theta=0;
#endif

string filename = "s3.json";

//------------------------------ real random number generator ---------------
double random_generator(double x_min_, double x_max_)
{
    double r = ((double)(rand())) / RAND_MAX;
    return x_min_ + r * (x_max_ - x_min_);
}

//------------------------------------- main -----------------------------------
int main(){

    //------------------------------------- start line ----------------------------------
    vector<Body> bodies; // bodies vector
    double position_i[2]; // variables with starting values
    double velocity_i[2];
    double mass_i = 2000;
    double radius_i = 2;

    double position_CM[]{0,0}; //position center of mass
    double velocity_CM[]{0,0}; //velocity center of mass
    double total_mass=0; //total mass of the system

    srand(time(NULL)); // random seed

    for(int j=0; j<N; ++j)
    { // random position and velocity initialization

        #ifdef CARTESIAN
        position_i[0] = random_generator(x_min, x_max);
        position_i[1] = random_generator(x_min, x_max);
        velocity_i[0] = random_generator(v_min, v_max);
        velocity_i[1] = random_generator(v_min, v_max);
        #endif

        #ifdef POLAR
        theta = random_generator(0, 2*M_PI);
        position_i[0] = random_generator(0,rho)*cos(theta);
        position_i[1] = random_generator(0,rho)*sin(theta);
        velocity_i[0] = random_generator(0, v_max)*cos(theta);
        velocity_i[1] = random_generator(0, v_max)*sin(theta);
        #endif
       
        bodies.push_back(Body(position_i, velocity_i, radius_i, mass_i));
    }

    //compute position and velocity of the center of mass and lock the reference
    for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
    {    
        total_mass += (*j).mass;
        position_CM[0] += (*j).mass * ((*j).position[0]);
        position_CM[1] += (*j).mass * ((*j).position[1]);
        velocity_CM[0] += (*j).mass * ((*j).velocity[0]);
        velocity_CM[1] += (*j).mass * ((*j).velocity[1]);
         
    }
    position_CM[0] = position_CM[0]/total_mass;
    position_CM[1] = position_CM[1]/total_mass;
    velocity_CM[0] = velocity_CM[0]/total_mass;
    velocity_CM[1] = velocity_CM[1]/total_mass;

    for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
    {    
        (*j).position[0] -= position_CM[0];
        (*j).position[1] -= position_CM[1];
        (*j).velocity[0] -= velocity_CM[0];
        (*j).velocity[1] -= velocity_CM[1];
         
    }
    //-------------------------------------------------

    //initial conservatives parameters
    double ang_mom_tot=0, E_tot=0;
    double momentum_tot[]{0,0};
    for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
    {
        if(j != bodies.end()-1)
        {
            for(vector<Body>::iterator k=j+1; k<bodies.end(); ++k) 
            {
                Body::force_and_potential(*j, *k);
            }
        }

        ang_mom_tot += (*j).get_orbital_momentum() + (*j).spin;
        momentum_tot[0] += (*j).get_x_momentum();
        momentum_tot[1] += (*j).get_y_momentum();
        E_tot += (*j).get_kinetic_energy() + (*j).internal_energy + 0.5*(*j).potential_energy;
    }

    cout << "L: " << ang_mom_tot << "\nE: " << E_tot << "\nPx: " << momentum_tot[0] << "\nPy: " << momentum_tot[1] << endl << endl;

    //reset force and potential energy
    for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
    {
        (*j).potential_energy = 0;
        (*j).acceleration[0] = 0;
        (*j).acceleration[1] = 0;
    }

    int response = 0;
    cout<<"Do you want to start the computation? (1:\"YES\", 0:\"NO\")\n";
    cout<<"Answer: ";
    cin>>response;

    if(response)
    {

    Serializer serializer(filename); //writing data on .json file

    //------------------------------------ evolution -------------------------------
    while(1)
    {   

        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end()-1; ++j)
        {
            for(vector<Body>::iterator k=j+1; k<bodies.end(); ++k){             
                // computing the distance of each couple of bodies: if this distance is minor than the sum of 
                // their radius, we merge them
                if(Body::distance(*j, *k) < ((*j).radius + (*k).radius)){
                    (*j).merge(*k);
                    bodies.erase(k);
                }
            }
        }

        bodies.shrink_to_fit();

        serializer.write(t, bodies);

        if (t >= t_f) break; // when we reach t_f the evolution terminates

    #ifdef EULER
    //-------------------------------------- Euler dynamic ----------------------------------------

        //reset potential energy
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
        {
            (*j).potential_energy = 0;
        }

        //compute force and potential energy
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end()-1; ++j)
        {   
            for(vector<Body>::iterator k=j+1; k<bodies.end(); ++k){
                Body::force_and_potential(*j, *k);
            }
        }
    
        // evolving the position and the velocity of each particle in dt
        for(vector<Body>::iterator i=bodies.begin(); i<bodies.end(); ++i) 
        {
            (*i).update_pos_vel(dt); 
        }
    //----------------------------------------------------------------------------------------------
    #endif

    #ifdef VERLET //PER IMPLEMENTARLO BISOGNA CAMBIARE UN PO' LA CLASSE
    //https://en.wikipedia.org/wiki/Verlet_integration#Velocity_Verlet
    /*accelerazione = forza (tempo, posizione) / massa;
tempo + = timestep;
posizione + = timestep * ( velocità + timestep * accelerazione / 2) ;
newAcceleration = force (time, position) / mass; 
velocity + = timestep * ( acceleration + newAcceleration) / 2 ;
*/

    //----------------------------------------- Verlet dynamic ------------------------------------
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j) 
        {
            (*j).potential_energy = 0;
            (*j).update_position(dt);//mettere quella giusta
        }
        
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
        {
            if(j != bodies.end()-1)
            {
                for(vector<Body>::iterator k=j+1; k<bodies.end(); ++k) 
                {
                    Body::force_and_potential(*j, *k);
                }
            }
            (*j).update_velocity(dt);
            (*j).update_position(dt/2);
            (*j).acceleration[0] = 0;
            (*j).acceleration[1] = 0;

        }

    #endif

    #ifdef SIMPLETIC
    //----------------------------------------- Simpletic dynamic ------------------------------------
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j) 
        {
            (*j).update_position(dt/2);
            (*j).potential_energy = 0;
        }
        
        for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
        {
            if(j != bodies.end()-1)
            {
                for(vector<Body>::iterator k=j+1; k<bodies.end(); ++k) 
                {
                    Body::force_and_potential(*j, *k);
                }
            }
            (*j).update_velocity(dt);
            (*j).update_position(dt/2);
            (*j).acceleration[0] = 0;
            (*j).acceleration[1] = 0;

        }
    //-----------------------------------------------------------------------------------------------------
    #endif

    t+=dt; // the time flows

    }

    //checking consevation
    ang_mom_tot=0, E_tot=0;
    momentum_tot[0]=0, momentum_tot[1]=0;
    for(vector<Body>::iterator j=bodies.begin(); j<bodies.end(); ++j)
    {
        ang_mom_tot += (*j).get_orbital_momentum() + (*j).spin;
        momentum_tot[0] += (*j).get_x_momentum();
        momentum_tot[1] += (*j).get_y_momentum();
        E_tot += (*j).get_kinetic_energy() + (*j).internal_energy + 0.5*(*j).potential_energy;
    }

    cout << "L: " << ang_mom_tot << "\nE: " << E_tot << "\nPx: " << momentum_tot[0] << "\nPy: " << momentum_tot[1] << endl;
    



    }
    else
    {
        cout<<"Next time will be better :)"<<endl;
    }
    



}



