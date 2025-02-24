package com.confy.gpt_gateway_service.provider;

import java.util.List;
import java.util.Map;

public class TreeFunctionSpecProvider {
    public static final Map<String, Object> TREE_FUNCTION_SPEC = Map.of(
            "name", "generateTreeVisualization",
            "description", "Generates a tree structure visualization in a consistent JSON format.",
            "parameters", Map.of(
                    "type", "object",
                    "properties", Map.of(
                            "agendaItems", Map.of(
                                    "type", "array",
                                    "items", Map.of(
                                            "type", "object",
                                            "properties", Map.of(
                                                    "id", Map.of("type", "string", "description", "The unique identifier of the node"),
                                                    "type", Map.of("type", "string", "description", "Type of node (topic, opinion)"),
                                                    "data", Map.of(
                                                            "type", "object",
                                                            "properties", Map.of(
                                                                    "idea", Map.of("type", "string", "description", "Content of the agenda item")
                                                            ),
                                                            "required", List.of("idea")
                                                    ),
                                                    "position", Map.of(
                                                            "type", "object",
                                                            "properties", Map.of(
                                                                    "x", Map.of("type", "number", "description", "x-coordinate"),
                                                                    "y", Map.of("type", "number", "description", "y-coordinate")
                                                            ),
                                                            "required", List.of("x", "y")
                                                    )
                                            ),
                                            "required", List.of("id", "type", "data", "position")
                                    )
                            ),
                            "relations", Map.of(
                                    "type", "array",
                                    "items", Map.of(
                                            "type", "object",
                                            "properties", Map.of(
                                                    "id", Map.of("type", "string", "description", "The unique identifier of the relation"),
                                                    "source", Map.of("type", "string", "description", "The source node ID"),
                                                    "target", Map.of("type", "string", "description", "The target node ID")
                                            ),
                                            "required", List.of("id", "source", "target")
                                    )
                            )
                    ),
                    "required", List.of("agendaItems", "relations")
            )
    );
}