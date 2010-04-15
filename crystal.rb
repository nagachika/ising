# encoding: utf-8

class Node
  def initialize(state, links=nil)
    @state = state
    @link = links
  end

  def setlinks(links)
    if(links.size != 4)
      raise ArgumentError, "link array size must be 4."
    end
    @link = links
  end

  def update(temperature)
    e = 0.0
    @link.each do |l|
      e += l.rel * l.nodes[0].state * l.nodes[1].state
    end
    r = Math.exp(-2*e/temperature.to_f)
    if(rand() <= r)
      @state *= -1
    end
  end

  attr_accessor :state

  def inspect
    if(@state > 0)
      "○"
    else
      "●"
    end
  end
end

class Link
  def initialize(rel, node=nil)
    if(node.size != 2)
      raise ArgumentError, "node array size must be 2."
    end
    @rel = rel
    @nodes = node
  end

  attr_accessor :rel, :nodes
end

class Ising
  def initialize(size, dope)
    @nodes = []
    @links = []
    (size*size).times do |i|
      @nodes << Node.new(rand() < 0.5 ? 1 : -1)
    end
    size.times do |iy|
      size.times do |ix|
        rel = (rand() < dope.to_f) ? -1 : 1
        nodes = [@nodes[ix+iy*size], @nodes[((ix+1)%size)+iy*size]]
        @links << Link.new(rel, nodes)
        rel = (rand() < dope.to_f) ? -1 : 1
        nodes = [@nodes[ix+iy*size], @nodes[ix+((iy+1)%size)*size]]
        @links << Link.new(rel, nodes)
      end
    end
    @nodes.each do |n|
      links = @links.inject([]) do |col, item|
        if(item.nodes.include?(n))
          col << item
        end
        col
      end
      n.setlinks(links)
    end
  end

  def step(temperature)
    @nodes[rand(@nodes.size)].update(temperature)
    self
  end

  def inspect
    size = Math.sqrt(@nodes.size).floor
    str = ""
    size.times do |iy|
      size.times do |ix|
        str << @nodes[ix+iy*size].inspect
      end
      str << "\n"
    end
    str
  end

  attr_accessor :nodes, :links
end

