package com.veltech.employeemgmt;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.veltech.employeemgmt.config.AppConfig;
import com.veltech.employeemgmt.service.EmployeeService;


public class App 
{
    public static void main( String[] args )
    {
        BeanFactory factory=new AnnotationConfigApplicationContext(AppConfig.class);
        EmployeeService service=factory.getBean(EmployeeService.class);
        service.createEmployee(101, "Raja", "cse");
        service.createEmployee(102, "kumar", "it");
        service.createEmployee(103, "anu", "ece");
        service.fetchAllEmployee().forEach(System.out::println);
        ((AnnotationConfigApplicationContext) factory).close();
        
        
    }
}
