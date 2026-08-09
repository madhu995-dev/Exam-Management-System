package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingRepository extends JpaRepository<Setting, Long> {

    Optional<Setting> findBySettingKey(String settingKey);

    boolean existsBySettingKey(String settingKey);

}