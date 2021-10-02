FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

# Install packages required by ros2
RUN apt-get update -q && apt-get upgrade -yq && apt-get install -yq \
  wget \
  curl \
  git \
  apt-transport-https \
  gnupg2 \
  lsb-release \
  locales \
  bash-completion \
  build-essential \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV ROS_DISTRO=foxy
ENV INSTALL_PACKAGE=desktop
RUN curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | apt-key add - \
  && sh -c 'echo "deb [arch=$(dpkg --print-architecture)] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/ros2-latest.list'
RUN apt-get update && apt-get install -yq \
  ros-${ROS_DISTRO}-${INSTALL_PACKAGE} \
  python3-argcomplete \
  python3-colcon-common-extensions \
  python3-rosdep python3-vcstool \
  && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN rosdep init && rosdep update


# Install npm
RUN apt-get update -q && apt-get install -yq \
  nodejs \
  npm \
  && npm install n -g \  
  && n latest \
  && apt-get purge -yq \
  nodejs \
  npm \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
