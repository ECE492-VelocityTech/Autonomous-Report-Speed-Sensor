package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Demo;
import com.VelocityTech.CarssBackend.Repository.DemoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemoService {
    private DemoRepository demoRepository;

    @Autowired
    public DemoService(DemoRepository demoRepository) {
        this.demoRepository = demoRepository;
    }

    public List<Demo> GetDemos() {
        return demoRepository.findAll();
    }
}
