package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.Demo;
import com.VelocityTech.CarssBackend.Service.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/demo")
public class DemoController {
    private DemoService demoService;

    @Autowired
    public DemoController(DemoService demoService) {
        this.demoService = demoService;
    }

    @GetMapping
    public ArrayList<String> GetDemo() {
        ArrayList<String> demoList = new ArrayList<>();
        demoList.add("abc");
        demoList.add("dfg");
        return demoList;
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> GetAllDemo() {
        List<Demo> demoList = demoService.GetDemos();
        List<String> names = new ArrayList<>();
        for (Demo d : demoList) {
            names.add(d.getName());
        }
        return ResponseEntity.ok(names);
    }

    @GetMapping("/all2")
    public Demo GetAllDemo2() {
        return new Demo();
    }
}
