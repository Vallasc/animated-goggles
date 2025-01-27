#include <iostream>
#include <fstream>
#include <vector> 
//#include <sstream>

#include "body.h"

#ifndef SERIALIZER_H
#define SERIALIZER_H

using namespace std;

class Serializer {
    private:
        ofstream outfile;
        ofstream outfile_energies;
        ofstream outfile_info;

        string file_name;

        int byte_written;
        int name_index;
        int potential_index;
        int num_iteration;
        stringstream potentials_json;
        const int max_file_size = 5000000; // 2MB
        const int file_compression = 10; // 1 low - 10 max
        
        const string file_version = "1.0.1";
        const string energies_file_name = "tmp/energies.bin";
        const string potentials_file_name = "tmp/potentials"; // potentialsX.bin
        const string info_file_name = "tmp/info.json";
        const string bin_file_name = "tmp/sim"; // simX.bin
        const string tmp_dir = "tmp";

        static string get_base_name(string const & path)
        {
            return path.substr(path.find_last_of("/\\") + 1);
        }
        void open_file();
        void split_file();
        void compress_files();
        void write_attr(string key, string value, bool is_num);
        void create_dir(string name);

    public:
        Serializer(string file_name);
        ~Serializer();
        std::string toStr(double x);
        void write_bodies(vector<Body> &state);
        void write_energies(float e_tot, float e_k_tot, float e_i_tot, float e_p_tot, float e_b_tot, float time);
        void write_potential(double** potential, int m, int n, double time);
        void write_init(double e_tot, double ang_mom_tot, double momentum_tot_x, double momentum_tot_y, int N, double mass_i);
        void write_err(double err_E, double err_ang_mom, double err_momentum_x,double err_momentum_y);
        void write_end(double e_tot, double ang_mom_tot, double momentum_tot_x, double momentum_tot_y);
};

#endif