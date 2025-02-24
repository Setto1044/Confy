package com.confy.auth_user_group_service.meetingResult.enums;

import java.util.Arrays;

public enum MeetingResultType {
    ALL("all"),
    FAVORITE("favorite"),
    GROUP("group");

    private final String value;

    MeetingResultType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    // 문자열로 변환할 때 안전하게 처리하는 메서드 추가
    public static MeetingResultType fromValue(String value) {
        return Arrays.stream(MeetingResultType.values())
                .filter(type -> type.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid MeetingResultType: " + value));
    }
}
