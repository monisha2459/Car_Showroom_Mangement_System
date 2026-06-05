package com.showroom.config;

import com.showroom.entity.Admin;
import com.showroom.entity.Car;
import com.showroom.entity.Customer;
import com.showroom.repository.AdminRepository;
import com.showroom.repository.CarRepository;
import com.showroom.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(AdminRepository adminRepo, CarRepository carRepo, CustomerRepository customerRepo) {
        return args -> {
            // Create default admin if not exists
            if (adminRepo.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setFullName("System Administrator");
                adminRepo.save(admin);
            }

            // Sample cars
            if (carRepo.count() == 0) {
                // {make, model, year, color, price, fuelType, transmission, mileage, imageUrl}
                String[][] cars = {
                    // Honda City — 5th Gen variants
                    {"Honda", "City V MT",   "2024", "Lunar Silver Metallic",   "1149000", "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg"},
                    {"Honda", "City VX MT",  "2024", "Radiant Red Metallic",    "1299000", "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg"},
                    {"Honda", "City ZX CVT", "2024", "Platinum White Pearl",    "1499000", "Petrol", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg"},
                    {"Honda", "City e:HEV",  "2024", "Meteoroid Gray Metallic", "1950000", "Hybrid", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City-Hybrid/10430/1666171174888/front-left-side-47.jpg"},

                    // Honda Amaze — 3rd Gen variants
                    {"Honda", "Amaze S MT",   "2024", "Radiant Red Metallic",   "799000",  "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/9367/1679298983837/front-left-side-47.jpg"},
                    {"Honda", "Amaze S MT",   "2024", "Golden Brown Metallic",  "849000",  "Diesel", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/9367/1679298983837/front-left-side-47.jpg"},
                    {"Honda", "Amaze VX CVT", "2024", "Lunar Silver Metallic",  "1099000", "Petrol", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/9367/1679298983837/front-left-side-47.jpg"},
                    {"Honda", "Amaze ZX CVT", "2024", "Platinum White Pearl",   "1199000", "Petrol", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/9367/1679298983837/front-left-side-47.jpg"},

                    // Honda Elevate variants
                    {"Honda", "Elevate V MT",   "2024", "Sonic Gray Pearl",        "1499000", "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Elevate/10730/1689677940807/front-left-side-47.jpg"},
                    {"Honda", "Elevate VX MT",  "2024", "Radiant Red Metallic",    "1699000", "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Elevate/10730/1689677940807/front-left-side-47.jpg"},
                    {"Honda", "Elevate ZX CVT", "2024", "Platinum White Pearl",    "1999000", "Petrol", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Elevate/10730/1689677940807/front-left-side-47.jpg"},
                    {"Honda", "Elevate ZX+",    "2024", "Meteoroid Gray Metallic", "2150000", "Petrol", "CVT",    "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Elevate/10730/1689677940807/front-left-side-47.jpg"},

                    // Honda WR-V variants
                    {"Honda", "WR-V S MT",  "2023", "Lunar Silver Metallic", "1099000", "Petrol", "Manual", "5000",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/WR-V/6673/1601281786045/front-left-side-47.jpg"},
                    {"Honda", "WR-V VX MT", "2023", "Radiant Red Metallic",  "1299000", "Petrol", "Manual", "3000",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/WR-V/6673/1601281786045/front-left-side-47.jpg"},
                    {"Honda", "WR-V ZX MT", "2023", "Platinum White Pearl",  "1399000", "Petrol", "Manual", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/WR-V/6673/1601281786045/front-left-side-47.jpg"},

                    // Honda Jazz
                    {"Honda", "Jazz V CVT",  "2023", "Lunar Silver Metallic", "899000", "Petrol", "CVT", "8000",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Jazz/6672/1601797174040/front-left-side-47.jpg"},
                    {"Honda", "Jazz VX CVT", "2023", "Radiant Red Metallic",  "999000", "Petrol", "CVT", "5000",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Jazz/6672/1601797174040/front-left-side-47.jpg"},

                    // Honda CR-V
                    {"Honda", "CR-V ZX AWD", "2024", "Platinum White Pearl", "3499000", "Petrol", "CVT", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/CR-V/6671/1564640910798/front-left-side-47.jpg"},
                    {"Honda", "CR-V e:HEV",  "2024", "Sonic Gray Pearl",     "3799000", "Hybrid", "CVT", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/CR-V/6671/1564640910798/front-left-side-47.jpg"},

                    // Honda HR-V
                    {"Honda", "HR-V ZX CVT", "2024", "Meteoroid Gray Metallic", "2199000", "Petrol", "CVT", "0",
                     "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/HR-V/9116/1638349580988/front-left-side-47.jpg"},
                };
                for (String[] c : cars) {
                    Car car = new Car();
                    car.setMake(c[0]); car.setModel(c[1]); car.setYear(Integer.parseInt(c[2]));
                    car.setColor(c[3]); car.setPrice(Double.parseDouble(c[4]));
                    car.setFuelType(c[5]); car.setTransmission(c[6]);
                    car.setMileage(Integer.parseInt(c[7]));
                    car.setImageUrl(c[8]);
                    car.setStatus("Available");
                    carRepo.save(car);
                }
            }

            // Sample customers
            if (customerRepo.count() == 0) {
                String[][] customers = {
                    {"Alice Johnson", "alice@email.com", "555-0101", "123 Main St"},
                    {"Bob Smith", "bob@email.com", "555-0102", "456 Oak Ave"},
                    {"Carol White", "carol@email.com", "555-0103", "789 Pine Rd"},
                };
                for (String[] c : customers) {
                    Customer customer = new Customer();
                    customer.setName(c[0]); customer.setEmail(c[1]);
                    customer.setPhone(c[2]); customer.setAddress(c[3]);
                    customerRepo.save(customer);
                }
            }
        };
    }
}
