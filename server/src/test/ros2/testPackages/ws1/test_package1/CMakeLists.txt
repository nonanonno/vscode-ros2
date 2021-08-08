cmake_minimum_required(VERSION 3.5)

project(test_package1)

# Default to C++14
if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 14)
endif()
if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake_auto REQUIRED)
ament_auto_find_build_dependencies()

set(msg_files
  "msg/Test1.msg"
  "msg/Test2.msg"
)

rosidl_generate_interfaces(${PROJECT_NAME}
  ${msg_files}
  ADD_LINTER_TESTS
)

ament_auto_package()
