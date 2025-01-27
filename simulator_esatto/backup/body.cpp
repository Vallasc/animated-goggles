#include <iostream>
#include <fstream>
#include <math.h>
#include <sstream>
#include <iomanip>

#include "body.h"
#include <vector>

 

extern double Temp_max;
extern double limit_radius;
extern double k_elastic;
double u_g, u_el, f, fx_a, fy_a;

//-------------------class constructors and operators-----------------------
//parametric costructor
Body::Body(int id_, double* position_, double* velocity_, double radius_, double mass_)
{
    //default inizialization variables
    acceleration[0]=0; acceleration[1]=0;
    internal_energy=0;
    binding_energy=0;
    potential_energy=0;
    spin=0;

    //variables
    velocity[0] = velocity_[0]; velocity[1] = velocity_[1];
    position[0] = position_[0]; position[1] = position_[1];
    radius = radius_;
    mass = mass_;
    id = id_;
    is_big_endian = check_big_endian();
    surpass_limit = 0;
    potential_costant = 0;
}


//-----------------class functions---------------------

//get_kinetic_energy()
double Body::get_kinetic_energy()
{
    return 0.5*mass*(pow(velocity[0], 2) + pow(velocity[1], 2));
}

//get_x_momentum()
double Body::get_x_momentum()
{
    return mass*velocity[0];
}

//get_y_momentum()
double Body::get_y_momentum()
{
    return mass*velocity[1];
}

//get_orbital_momentum()
double Body::get_orbital_momentum()
{
   return mass*(position[0]*velocity[1]-position[1]*velocity[0]);    
}

//get_color()
int Body::get_color()
{
    int color;
    double temperature = this->internal_energy/this->mass;
    if(temperature < Temp_max/10) color = 1;
    else if(temperature < 2*Temp_max/10) color = 2;
    else if(temperature < 3*Temp_max/10) color = 3;
    else if(temperature < 4*Temp_max/10) color = 4;
    else if(temperature < 5*Temp_max/10) color = 5;
    else if(temperature < 6*Temp_max/10) color = 6;
    else if(temperature < 7*Temp_max/10) color = 7;
    else if(temperature < 8*Temp_max/10) color = 8;
    else if(temperature < 9*Temp_max/10) color = 9;
    else color = 10;
    
    return color;
}

//b.merge(a); simulate a complete anelastic collision. b receive updated attributes, a must be deleted after the call of the function.
double* Body::merge(Body& a)
    {    
        
        //dummy array
        double* old_parameters = new double[8];
        old_parameters[0] = this->position[0];
        old_parameters[1] = this->position[1];
        old_parameters[2] = a.position[0];
        old_parameters[3] = a.position[1];
        old_parameters[4] = this->mass;
        old_parameters[5] = a.mass;
        old_parameters[6] = this->potential_energy;
        old_parameters[7] = a.potential_energy;

        //dummy variables
        double kinetic_initial = a.get_kinetic_energy() + this->get_kinetic_energy();
        double orbital_initial = a.get_orbital_momentum() + this->get_orbital_momentum();
        double delta_potential = (-(this->mass*a.mass)/distance(*this,a));

        //center of mass position
        this->position[0] = (a.mass*a.position[0] + this->mass*this->position[0])/(this->mass + a.mass);
        this->position[1] = (a.mass*a.position[1] + this->mass*this->position[1])/(this->mass + a.mass);

        //center of mass velocity
        this->velocity[0] = (a.mass*a.velocity[0] + this->mass*this->velocity[0])/(this->mass + a.mass);
        this->velocity[1] = (a.mass*a.velocity[1] + this->mass*this->velocity[1])/(this->mass + a.mass);

        //sum of volumes
        this->radius = pow((pow(this->radius,3) + pow(a.radius,3)), double(1)/3);

        //sum of masses
        this->mass += a.mass;

        //update internal_energy. sum of internal energy + difference of initial and final kinetic energy
        this->internal_energy += (a.internal_energy + (kinetic_initial - this->get_kinetic_energy()));

        //update the binding energy.
        this->binding_energy += (a.binding_energy);
        
        //this->potential_energy -= delta_potential;
        this->potential_energy=0;

        //update angular momentum. sum of spins + difference of initial and final orbital momentum
        this->spin += (a.spin + (orbital_initial - this->get_orbital_momentum()));

        return old_parameters;
    }

//b.print(); show all attributes of b.
void Body::print()
{
    std::cout<<"position: "<<this->position[0]<<", "<<this->position[1]<<std::endl;
    std::cout<<"velocity: "<<this->velocity[0]<<", "<<this->velocity[1]<<std::endl;
    std::cout<<"acceleration: "<<this->acceleration[0]<<", "<<this->acceleration[1]<<std::endl;
    std::cout<<"radius: "<<this->radius<<std::endl;
    std::cout<<"mass: "<<this->mass<<std::endl;
    std::cout<<"kinetic energy: "<<this->get_kinetic_energy()<<std::endl;
    std::cout<<"internal energy: "<<this->internal_energy<<std::endl;
    std::cout<<"binding energy: "<<this->binding_energy<<std::endl;
    std::cout<<"potential energy: "<<this->potential_energy<<std::endl;
    std::cout<<"orbital momentum: "<<this->get_orbital_momentum()<<std::endl;
    std::cout<<"spin: "<<this->spin<<"\n\n";

}

//b.update_position(dt); update the position of b using costant accelerated motion over a dt time.
void Body::update_position(double dt)
{
    position[0] += velocity[0]*dt;
    position[1] += velocity[1]*dt;
}

//b.update_velocity(dt); update the velocity of b using costant accelerated motion over a dt time.
void Body::update_velocity(double dt)
{
    velocity[0] += acceleration[0]*dt;
    velocity[1] += acceleration[1]*dt;
}

//b.update_pos_vel(dt); update position (updatePosition(dt)) and velocity (updateVelocity(dt)) of b and reset acceleration.
void Body::update_pos_vel(double dt)
{
    update_position(dt);
    update_velocity(dt);
    this->acceleration[0] = 0;
    this->acceleration[1] = 0;
}

std::string Body::to_json()
{
    std::stringstream ss;
    ss <<  "{";
    ss <<"\"x\":"<< this->position[0] << ",";
    ss <<"\"y\":"<< this->position[1] << ",";
    ss <<"\"r\":"<< this->radius << ",";
    ss <<"\"k\":"<< this->get_kinetic_energy() << ",";
    ss <<"\"i\":"<< this->internal_energy;
    ss <<  "}";
    return ss.str();
}

int Body::write_to_file(std::ofstream &outfile)
{
    float id = Body::reverse_float((float) this->id);
    float x = Body::reverse_float((float) this->position[0]);
    float y = Body::reverse_float((float) this->position[1]);
    float r = Body::reverse_float((float) this->radius);
    float t = (float) this->get_color();

    outfile.write(reinterpret_cast<char*>(& id ), sizeof(float)); // 16 bit?
    outfile.write(reinterpret_cast<char*>(& x ), sizeof(float));
    outfile.write(reinterpret_cast<char*>(& y ), sizeof(float));
    outfile.write(reinterpret_cast<char*>(& r ), sizeof(float)); // 16 bit?
    outfile.write(reinterpret_cast<char*>(& t ), sizeof(float));
    return sizeof(float) * 5; // N byte scritti
}

//---------------static methods------------------------
//distance(a,b); return the distance between a and b.
double Body::distance(const Body &a, const Body &b)
{
    return sqrt(pow(a.position[0]-b.position[0],2) + pow(a.position[1]-b.position[1],2));
}

double Body::distance_(const Body &a, double* p)
{
    return sqrt(pow(a.position[0]-p[0],2) + pow(a.position[1]-p[1],2));
};

double Body::distancep(double* q, double* p)
{
    return sqrt(pow(q[0]-p[0],2) + pow(q[1]-p[1],2));
};

//force_and_potential(a,b); compute gravitational force between a and b and update the acceleration of each bodies.
void Body::force_and_potential(Body &a, Body &b)
{
    double dist = distance(a,b);

    if(a.surpass_limit==0)
    {
        if(dist>=limit_radius) {a.surpass_limit=2; b.surpass_limit=2;}
        if(dist<limit_radius) {a.surpass_limit=-2; b.surpass_limit=-2;}
    }

    if(a.surpass_limit==2 && dist<limit_radius) {a.surpass_limit=-1; b.surpass_limit=-1;}

    if(a.surpass_limit==2)
    {
        u_g = -(b.mass*a.mass)/(dist); 
  
        f = (b.mass*a.mass)/(pow(dist, 3));
        fx_a = f*(b.position[0]-a.position[0]);//force along x on a
        fy_a = f*(b.position[1]-a.position[1]);//force along y on a

        a.acceleration[0] += fx_a/(a.mass);//updating acceleration
        a.acceleration[1] += fy_a/(a.mass);

        b.acceleration[0] -= fx_a/(b.mass);//let f_a the force acting on a, therefore -f_a is the force actiong on b (third newton principle)
        b.acceleration[1] -= fy_a/(b.mass);

        //potential energy
        a.potential_energy += u_g;
        b.potential_energy += u_g;
    }
    
    if(a.surpass_limit==-1 || a.surpass_limit==-2)
    {
       u_el = 0.5*a.mass*b.mass*k_elastic*pow(dist,2);

        if(a.surpass_limit==-1)
        {
            k_elastic=1/pow(dist, 3);
            u_el = 0.5*a.mass*b.mass*k_elastic*pow(dist,2);
            u_g = -(b.mass*a.mass)/(dist); 
            a.potential_costant = u_g-u_el;
            b.potential_costant = a.potential_costant;
            a.surpass_limit=-2;
            b.surpass_limit=-2;
        }

        a.acceleration[0] += b.mass*k_elastic*(b.position[0]-a.position[0]);
        a.acceleration[1] += b.mass*k_elastic*(b.position[1]-a.position[1]);
        
        b.acceleration[0] += -a.mass*k_elastic*(b.position[0]-a.position[0]);
        b.acceleration[1] += -a.mass*k_elastic*(b.position[1]-a.position[1]);
        
        a.potential_energy += u_el + a.potential_costant;
        b.potential_energy += u_el + b.potential_costant;

    }

}

float Body::reverse_float( const float inFloat )
{
    if(!is_big_endian) return inFloat;
    float retVal;
    char *floatToConvert = ( char* ) & inFloat;
    char *returnFloat = ( char* ) & retVal;

    returnFloat[0] = floatToConvert[3];
    returnFloat[1] = floatToConvert[2];
    returnFloat[2] = floatToConvert[1];
    returnFloat[3] = floatToConvert[0];

    return retVal;
}