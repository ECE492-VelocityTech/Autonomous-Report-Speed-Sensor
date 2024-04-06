package com.VelocityTech.CarssBackend.Configuration;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class Constants {
    public static Duration ReachableThresholdTime = Duration.ofHours(1);

    public static LocalDateTime NullTime = LocalDateTime.of(1970, 1, 1, 0, 0)
            .atOffset(ZoneOffset.UTC)
            .toLocalDateTime();

    public static DateTimeFormatter TimeSyncFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
}
