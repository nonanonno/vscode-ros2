ARG ros_distro=foxy
FROM ros:${ros_distro}

RUN apt-get update -q && apt-get upgrade -yq && apt-get clean && rm -rf /var/lib/apt/lists/*


# Install npm
RUN apt-get update -q && apt-get install -yq \
  nodejs \
  npm \
  wget \
  curl \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  && npm install n -g \
  && n latest \
  && apt-get purge -yq \
  nodejs \
  npm \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install utilities
RUN apt-get update -q && apt-get install -yq \
  ssh \
  git \
  vim \
  bash-completion \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

ARG username=vscode
ARG user_uid=1000
ARG user_gid=${user_uid}

RUN groupadd --gid ${user_gid} ${username} \
  && useradd --uid ${user_uid} --gid ${user_gid} -m ${username} -s /bin/bash \
  && apt-get update \
  && apt-get install -y sudo \
  && echo ${username} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${username} \
  && chmod 0440 /etc/sudoers.d/${username}

USER ${username}
