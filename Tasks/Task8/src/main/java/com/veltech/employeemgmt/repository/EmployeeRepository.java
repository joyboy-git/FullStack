package com.veltech.employeemgmt.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.veltech.employeemgmt.Employee;

@Component
public class EmployeeRepository {

    private List<Employee> employeelist = new ArrayList<>();

    public void addEmployee(Employee employee) {
        employeelist.add(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeelist;
    }
}